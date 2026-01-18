"use client";

import { useState, useEffect } from "react";
import {
    Database,
    Mail,
    FileText,
    CreditCard,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertTriangle,
    Server,
    RefreshCw,
    Download,
    Send,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";

interface TestResult {
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
    duration?: number;
}

type TestStatus = "idle" | "running" | "success" | "error";

interface TestState {
    status: TestStatus;
    result?: TestResult;
}

const TEST_EMAIL = "test@zecurx.com";

export default function SystemTestPage() {
    const [tests, setTests] = useState<Record<string, TestState>>({
        database: { status: "idle" },
        email: { status: "idle" },
        invoice: { status: "idle" },
        razorpay: { status: "idle" },
        webhook: { status: "idle" },
        storage: { status: "idle" },
    });

    const [emailTo, setEmailTo] = useState("");
    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
    const [lmsResetLinkEnabled, setLmsResetLinkEnabled] = useState<boolean>(true);
    const [lmsToggleLoading, setLmsToggleLoading] = useState(false);

    const updateTest = (name: string, state: Partial<TestState>) => {
        setTests((prev) => ({
            ...prev,
            [name]: { ...prev[name], ...state },
        }));
    };

    useEffect(() => {
        fetch("/api/admin/settings?key=lms_reset_link_enabled")
            .then((res) => res.json())
            .then((data) => {
                if (data.value !== undefined) {
                    setLmsResetLinkEnabled(data.value === true || data.value === "true");
                }
            })
            .catch(console.error);
    }, []);

    const toggleLmsResetLinkSetting = async () => {
        setLmsToggleLoading(true);
        try {
            const newValue = !lmsResetLinkEnabled;
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "lms_reset_link_enabled", value: newValue }),
            });
            if (res.ok) {
                setLmsResetLinkEnabled(newValue);
            }
        } catch (error) {
            console.error("Failed to toggle LMS reset link setting:", error);
        } finally {
            setLmsToggleLoading(false);
        }
    };

    const runTest = async (
        name: string,
        endpoint: string,
        options?: RequestInit
    ) => {
        updateTest(name, { status: "running", result: undefined });
        const startTime = Date.now();

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                ...options,
            });

            const data = await response.json();
            const duration = Date.now() - startTime;

            if (response.ok && data.success) {
                updateTest(name, {
                    status: "success",
                    result: { ...data, duration },
                });
                return data;
            } else {
                updateTest(name, {
                    status: "error",
                    result: {
                        success: false,
                        message: data.error || data.message || "Test failed",
                        details: data,
                        duration,
                    },
                });
                return null;
            }
        } catch (error) {
            const duration = Date.now() - startTime;
            updateTest(name, {
                status: "error",
                result: {
                    success: false,
                    message: error instanceof Error ? error.message : "Network error",
                    duration,
                },
            });
            return null;
        }
    };

    const testDatabase = () => runTest("database", "/api/admin/test/database");

    const testEmail = async () => {
        const email = emailTo.trim() || TEST_EMAIL;
        return runTest("email", "/api/admin/test/email", {
            body: JSON.stringify({ email }),
        });
    };

    const testInvoice = async () => {
        const result = await runTest("invoice", "/api/admin/test/invoice");
        if (result?.pdfBase64) {
            const blob = base64ToBlob(result.pdfBase64, "application/pdf");
            setInvoiceUrl(URL.createObjectURL(blob));
        }
    };

    const testRazorpay = () => runTest("razorpay", "/api/admin/test/razorpay");

    const testWebhook = () => runTest("webhook", "/api/admin/test/webhook");

    const testStorage = () => runTest("storage", "/api/admin/test/storage");

    const runAllTests = async () => {
        await testDatabase();
        await testRazorpay();
        await testStorage();
        await testWebhook();
    };

    const base64ToBlob = (base64: string, type: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Blob([new Uint8Array(byteNumbers)], { type });
    };

    const getStatusIcon = (status: TestStatus) => {
        switch (status) {
            case "running":
                return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
            case "success":
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
        }
    };

    const getStatusBg = (status: TestStatus) => {
        switch (status) {
            case "running":
                return "bg-blue-500/10 border-blue-500/30";
            case "success":
                return "bg-green-500/10 border-green-500/30";
            case "error":
                return "bg-red-500/10 border-red-500/30";
            default:
                return "bg-card border-border";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">System Tests</h1>
                    <p className="text-muted-foreground mt-1">
                        Test integrations without affecting production data
                    </p>
                </div>
                <button
                    onClick={runAllTests}
                    disabled={Object.values(tests).some((t) => t.status === "running")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Run All Tests
                </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-amber-500">Safe Testing Mode</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        All tests use mock/test data. No real transactions, customers, or
                        emails to production users will be created.
                    </p>
                </div>
            </div>

            <div className={`border rounded-xl p-6 transition-colors ${lmsResetLinkEnabled ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${lmsResetLinkEnabled ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                            <Mail className={`w-5 h-5 ${lmsResetLinkEnabled ? "text-green-500" : "text-amber-500"}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">LMS Password Reset Link in Emails</h3>
                            <p className="text-sm text-muted-foreground">
                                {lmsResetLinkEnabled 
                                    ? "Purchase emails will include LMS password reset link for new users" 
                                    : "Purchase emails will NOT include LMS password reset link (invoice still sent)"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleLmsResetLinkSetting}
                        disabled={lmsToggleLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {lmsToggleLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : lmsResetLinkEnabled ? (
                            <ToggleRight className="w-10 h-10 text-green-500" />
                        ) : (
                            <ToggleLeft className="w-10 h-10 text-amber-500" />
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Database Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.database.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Database</h3>
                                <p className="text-sm text-muted-foreground">
                                    PostgreSQL connection
                                </p>
                            </div>
                        </div>
                        {getStatusIcon(tests.database.status)}
                    </div>
                    <button
                        onClick={testDatabase}
                        disabled={tests.database.status === "running"}
                        className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                    >
                        Test Connection
                    </button>
                    {tests.database.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.database.result.message}</p>
                            {tests.database.result.duration && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Completed in {tests.database.result.duration}ms
                                </p>
                            )}
                            {tests.database.result.details && (
                                <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
                                    {JSON.stringify(tests.database.result.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>

                {/* Email Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.email.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Email (SMTP)</h3>
                                <p className="text-sm text-muted-foreground">Resend API</p>
                            </div>
                        </div>
                        {getStatusIcon(tests.email.status)}
                    </div>
                    <div className="space-y-3">
                        <input
                            type="email"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="Your email (to receive test)"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                            onClick={testEmail}
                            disabled={tests.email.status === "running"}
                            className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Test Email
                        </button>
                    </div>
                    {tests.email.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.email.result.message}</p>
                            {tests.email.result.duration && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Completed in {tests.email.result.duration}ms
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Invoice Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.invoice.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Invoice PDF</h3>
                                <p className="text-sm text-muted-foreground">PDF generation</p>
                            </div>
                        </div>
                        {getStatusIcon(tests.invoice.status)}
                    </div>
                    <button
                        onClick={testInvoice}
                        disabled={tests.invoice.status === "running"}
                        className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                    >
                        Generate Test Invoice
                    </button>
                    {tests.invoice.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.invoice.result.message}</p>
                            {invoiceUrl && (
                                <a
                                    href={invoiceUrl}
                                    download="test-invoice.pdf"
                                    className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Invoice
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Razorpay Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.razorpay.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Razorpay</h3>
                                <p className="text-sm text-muted-foreground">Payment gateway</p>
                            </div>
                        </div>
                        {getStatusIcon(tests.razorpay.status)}
                    </div>
                    <button
                        onClick={testRazorpay}
                        disabled={tests.razorpay.status === "running"}
                        className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                    >
                        Test Razorpay API
                    </button>
                    {tests.razorpay.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.razorpay.result.message}</p>
                            {tests.razorpay.result.details && (
                                <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
                                    {JSON.stringify(tests.razorpay.result.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>

                {/* Webhook Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.webhook.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Server className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Webhook</h3>
                                <p className="text-sm text-muted-foreground">
                                    Razorpay webhook endpoint
                                </p>
                            </div>
                        </div>
                        {getStatusIcon(tests.webhook.status)}
                    </div>
                    <button
                        onClick={testWebhook}
                        disabled={tests.webhook.status === "running"}
                        className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                    >
                        Test Webhook Endpoint
                    </button>
                    {tests.webhook.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.webhook.result.message}</p>
                            {tests.webhook.result.details && (
                                <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
                                    {JSON.stringify(tests.webhook.result.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>

                {/* Storage Test */}
                <div
                    className={`border rounded-xl p-6 transition-colors ${getStatusBg(
                        tests.storage.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Server className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Storage</h3>
                                <p className="text-sm text-muted-foreground">Linode S3</p>
                            </div>
                        </div>
                        {getStatusIcon(tests.storage.status)}
                    </div>
                    <button
                        onClick={testStorage}
                        disabled={tests.storage.status === "running"}
                        className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                    >
                        Test Storage Connection
                    </button>
                    {tests.storage.result && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg">
                            <p className="text-sm font-medium">{tests.storage.result.message}</p>
                            {tests.storage.result.details && (
                                <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
                                    {JSON.stringify(tests.storage.result.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Environment Info */}
            <div className="border border-border rounded-xl p-6 bg-card">
                <h3 className="font-semibold text-foreground mb-4">Environment Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Environment</p>
                        <p className="font-medium text-foreground">
                            {process.env.NODE_ENV || "production"}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Dev Mode</p>
                        <p className="font-medium text-foreground">
                            {process.env.NEXT_PUBLIC_DEV_MODE === "true" ? "Enabled" : "Disabled"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

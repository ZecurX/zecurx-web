export function HeroShine() {
  return (
    <div className="relative w-full h-px">
      {/* Simple gradient fade line — barely there */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, #c7d2e0 30%, #94a3b8 50%, #c7d2e0 70%, transparent 95%)",
        }}
      />
    </div>
  );
}

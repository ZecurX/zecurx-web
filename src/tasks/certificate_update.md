# Certificate Template Update Task (COMPLETED)

## Changelog
- **Replaced**: `public/certificate-template.pdf` with the clean version (no pre-printed labels).
- **Regenerated**: `public/certificate-template-bg.png` from the new PDF.
- **Updated Logic**: `src/lib/certificate.ts` now dynamically renders:
    - **Labels**: "Issue Date:", "Certificate ID:", "Date:", "Place:" (Helvetica, Size 14).
    - **Values**: Specific data for each field (Helvetica Bold, Size 18).
- **Refined Layout**: 
    - Moved Recipient Name (Y=460) and Seminar Title (Y=320) higher to clear central graphics.
    - Widened bottom columns (Left X=120, Right X=1150) for a balanced footer.
    - Increased Font Sizes: Labels (16pt), Values (24pt/Bold).
- **Dynamic Location**: Updated logic to fetch `venue_address` from the database. Displays "Online" or the specific venue instead of a hardcoded "India".
- **Status**: Live, verified, and approved by user.

## Context
The user has a new certificate design with blank spaces for dynamic data (Recipient Name, Seminar Title, Date, etc.). We need to update the certificate generation logic to use this new template and align the text correctly.

## Steps
1.  **Receive Files**: User to provide `certificate-template.pdf` and a high-res image (e.g., `certificate-template-bg.png`). (DONE)
2.  **Update Assets**: specific files in `public/` need to be replaced. (DONE)
    - `public/certificate-template.pdf`
    - `public/certificate-template-bg.png`
3.  **Calibrate Coordinates**: (DONE)
    - Update `src/lib/certificate.ts`:
        - `generateCertificatePDF`: Adjust `drawText` (x, y) coordinates.
        - `generateCertificatePreview`: Adjust SVG `text` (x, y) attributes.
4.  **Verification**: (DONE)
    - Generate a test certificate and check alignment.
    - Iterate coordinates until perfect.

## Required Information from User
- The files (obviously). (RECEIVED)
- Which fields go where? (Name, Title, Date, ID, etc.) (INFERRED FROM SCREENSHOT)
- Font preferences (if different from Helvetica). (KEPT HELVETICA)

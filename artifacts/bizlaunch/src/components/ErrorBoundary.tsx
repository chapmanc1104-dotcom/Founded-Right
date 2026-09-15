import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Catches render errors so a single bad component shows a recoverable message
 * instead of a blank white page.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaced in the browser console; wire to an error reporter when one exists.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F8FA",
          fontFamily: "Inter, sans-serif",
          padding: 20,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#1B3A6B",
              marginBottom: 10,
            }}
          >
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 22 }}>
            Your saved data is safe. Reloading usually fixes this — if it keeps
            happening, email{" "}
            <a href="mailto:support@foundedright.co" style={{ color: "#2D5BE3" }}>
              support@foundedright.co
            </a>
            .
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "11px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

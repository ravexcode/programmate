export interface RequestTemplateProps {
  username: string;
  link: string;
}

export function RequestTemplate({
  username,
  link,
}: RequestTemplateProps) {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 24px",
        borderRadius: "16px",
        backgroundColor: "#101010",
        color: "#ffffff",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          marginBottom: "24px",
        }}
      >
        You've received a new project request
      </h2>

      <p style={{ marginBottom: "16px", lineHeight: "1.6" }}>
        Hello {username},
        <br />
        You have received a new project request.
      </p>

      <p
        style={{
          marginBottom: "40px",
          lineHeight: "1.6",
          opacity: 0.85,
        }}
      >
        To accept the request, click the button below.
        <br />
        If you're not interested, you can safely ignore this email.
      </p>

      <a
        href={link}
        style={{
          display: "inline-block",
          padding: "12px 32px",
          borderRadius: "999px",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        Accept Request
      </a>

      <footer
        style={{
          marginTop: "40px",
          fontSize: "13px",
          opacity: 0.7,
        }}
      >
        Prismaflow © 2026
      </footer>
    </div>
  );
}

export interface LoginWarnProps {
  username: string;
  logged_in: Date
}

export function LoginWarn(props : LoginWarnProps){
  return (
    <div
    className="w-150 px-6 py-10 rounded-xl bg-neutral-900 text-text text-center">
      <h2
      className="font-semibold tracking-wide text-xl">
        You've logged in at: { props.logged_in.toLocaleTimeString() }
      </h2>

      <p
      className="mt-5">
        Hello {props.username.toLowerCase()}, you've logged in Prismaflow..
      </p>

      <p
      className="mt-2 mb-10">
        If it wasn't you, we recommend changing your password now!
      </p>
      
      <footer
      className="opacity-80 mt-10 text-sm font-light">
        Prismaflow - 2026
      </footer>
    </div>
  )
}
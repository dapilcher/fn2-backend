// admin/config.tsx
function CustomLogo() {
  return (
    <h1 style={{ fontSize: "1.5em", color: "#c1292e" }}>
      Flightless Nerd Admin
    </h1>
  );
}

export const components = {
  Logo: CustomLogo,
};

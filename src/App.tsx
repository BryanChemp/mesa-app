import { ThemeProvider } from "styled-components"
import { theme } from "./shared/styles/theme"
import AppRoutes from "./routes/app.routes"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App

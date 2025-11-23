
import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes';

export default function IndexRoutes() {
  const user = true

  return (
    user ? <AppRoutes /> : <AuthRoutes />
  )
}
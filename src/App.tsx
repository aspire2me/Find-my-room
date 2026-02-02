import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { GeneratePage } from "@/pages/GeneratePage"
import { GalleryPage } from "@/pages/GalleryPage"
import { ConversionDetailPage } from "@/pages/ConversionDetailPage"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/generate", element: <GeneratePage /> },
          { path: "/gallery", element: <GalleryPage /> },
          { path: "/gallery/:id", element: <ConversionDetailPage /> },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
  fallback: ReactNode
  onError?: (error: Error) => void
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Experience error:", error, info.componentStack)
    this.props.onError?.(error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

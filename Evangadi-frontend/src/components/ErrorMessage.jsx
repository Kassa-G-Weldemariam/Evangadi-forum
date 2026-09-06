function ErrorMessage({ children, id }) {
  return <p className="error" id={id} role="alert">{children}</p>
}

export default ErrorMessage

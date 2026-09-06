import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import { questionApi } from '../api/client'

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 2000

function Ask() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [event.target.name]: '',
    }))
    setSubmitError('')
  }

  function validateForm() {
    const errors = {}
    const title = form.title.trim()
    const description = form.description.trim()

    if (!title) errors.title = 'Question title is required.'
    if (title.length > MAX_TITLE_LENGTH) {
      errors.title = `Question title must be ${MAX_TITLE_LENGTH} characters or fewer.`
    }
    if (!description) errors.description = 'Question description is required.'
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Question description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
    }
    return { errors, title, description }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const { errors, title, description } = validateForm()
    setFieldErrors(errors)
    setSubmitError('')
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await questionApi.create({ title, description })
      if (!response || typeof response.msg !== 'string') {
        throw new Error('The question was submitted, but the server returned an unexpected response.')
      }
      navigate('/', { replace: true, state: { message: response.msg } })
    } catch (requestError) {
      setSubmitError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page ask-page">
      <h1>Ask a question</h1>
      <p>Share your question with the Evangadi Forum community.</p>
      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
      <form className="question-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="question-title">Question title</label>
        <input
          id="question-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What would you like to ask?"
          maxLength={MAX_TITLE_LENGTH}
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? 'question-title-error' : undefined}
          required
        />
        {fieldErrors.title && <ErrorMessage id="question-title-error">{fieldErrors.title}</ErrorMessage>}

        <label htmlFor="question-description">Question description</label>
        <textarea
          id="question-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add the details that will help others understand your question."
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows="8"
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={fieldErrors.description ? 'question-description-error' : undefined}
          required
        />
        {fieldErrors.description && <ErrorMessage id="question-description-error">{fieldErrors.description}</ErrorMessage>}

        <div className="question-form__actions">
          <button className="button button--secondary-light" type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Ask

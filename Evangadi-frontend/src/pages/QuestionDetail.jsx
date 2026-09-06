import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnswerCard from '../components/AnswerCard'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import { questionApi } from '../api/client'
import { useAuth } from '../context/useAuth'

const MAX_ANSWER_LENGTH = 5000

function QuestionDetail() {
  const { questionid } = useParams()
  const { user } = useAuth()
  const [questionData, setQuestionData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadQuestion = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await questionApi.getById(questionid)
      if (!data || !data.Q || !Array.isArray(data.answers)) {
        throw new Error('The server returned an unexpected question response.')
      }
      setQuestionData(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [questionid])

  useEffect(() => {
    loadQuestion()
  }, [loadQuestion])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedAnswer = answer.trim()
    if (!trimmedAnswer) {
      setAnswerError('Answer text is required.')
      return
    }
    if (trimmedAnswer.length > MAX_ANSWER_LENGTH) {
      setAnswerError(`Answer must be ${MAX_ANSWER_LENGTH} characters or fewer.`)
      return
    }

    setAnswerError('')
    setIsSubmitting(true)
    try {
      const response = await questionApi.createAnswer(questionid, { answer: trimmedAnswer })
      if (!response || typeof response.answer !== 'string' || typeof response.username !== 'string') {
        throw new Error('The answer was submitted, but the server returned an unexpected response.')
      }
      setAnswer('')
      await loadQuestion()
    } catch (requestError) {
      setAnswerError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <Loading label="Loading question..." />
  if (error) {
    return (
      <section className="page state-card">
        <ErrorMessage>{error}</ErrorMessage>
        <button className="button" type="button" onClick={loadQuestion}>Try again</button>
        <p><Link to="/">Back to questions</Link></p>
      </section>
    )
  }

  const { Q: question, answers } = questionData

  return (
    <section className="detail-page">
      <Link className="back-link" to="/">Back to questions</Link>
      <article className="question-detail">
        <h1>{question.title}</h1>
        <div className="question-card__meta">
          {question.username && <span>Asked by {question.username}</span>}
          {question.created_at && (
            <time dateTime={question.created_at}>
              {new Date(question.created_at).toLocaleDateString()}
            </time>
          )}
        </div>
        <p className="question-detail__description">{question.description}</p>
      </article>

      <section className="answers-section" aria-labelledby="answers-heading">
        <h2 id="answers-heading">Answers ({answers.length})</h2>
        {answers.length > 0 ? (
          <div className="answer-list">
            {answers.map((item, index) => (
              <AnswerCard key={item.answerid || `${item.username}-${index}`} answer={item} />
            ))}
          </div>
        ) : (
          <div className="state-card"><p>No answers have been posted yet.</p></div>
        )}
      </section>

      {user ? (
        <form className="question-form answer-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="answer-text">Your answer</label>
          <textarea
            id="answer-text"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)
              setAnswerError('')
            }}
            placeholder="Share a helpful answer..."
            maxLength={MAX_ANSWER_LENGTH}
            rows="6"
            aria-invalid={Boolean(answerError)}
            aria-describedby={answerError ? 'answer-error' : undefined}
            required
          />
          {answerError && <ErrorMessage id="answer-error">{answerError}</ErrorMessage>}
          <div className="question-form__actions">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="state-card answer-login-prompt">
          <p><Link to="/login">Log in</Link> to post an answer.</p>
        </div>
      )}
    </section>
  )
}

export default QuestionDetail

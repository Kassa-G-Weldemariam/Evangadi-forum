import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import QuestionCard from '../components/QuestionCard'
import { questionApi } from '../api/client'

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage] = useState(() => location.state?.message || '')

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const loadQuestions = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await questionApi.getAll()
      if (!Array.isArray(data)) {
        throw new Error('The server returned an unexpected questions response.')
      }
      setQuestions(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return (
    <section className="home-page">
      {successMessage && <p className="success-message" role="status">{successMessage}</p>}
      <div className="home-page__intro">
        <div>
          <h1>Welcome to Evangadi Forum</h1>
          <p>Ask questions, share what you know, and learn from the community.</p>
        </div>
        <Link className="button" to="/ask">Ask Question</Link>
      </div>

      <section aria-labelledby="questions-heading">
        <h2 id="questions-heading">Recent questions</h2>
        {isLoading && <Loading label="Loading questions..." />}
        {!isLoading && error && (
          <div className="state-card">
            <ErrorMessage>{error}</ErrorMessage>
            <button className="button" type="button" onClick={loadQuestions}>Try again</button>
          </div>
        )}
        {!isLoading && !error && questions.length === 0 && (
          <div className="state-card">
            <p>No questions have been posted yet.</p>
            <Link className="button" to="/ask">Ask the first question</Link>
          </div>
        )}
        {!isLoading && !error && questions.length > 0 && (
          <div className="question-list">
            {questions.map((question) => (
              <QuestionCard key={question.questionid} question={question} />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export default Home

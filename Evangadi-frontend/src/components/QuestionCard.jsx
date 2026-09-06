import { Link } from 'react-router-dom'

function QuestionCard({ question }) {
  return (
    <article className="question-card">
      <div className="question-card__content">
        <h2>
          <Link to={`/questions/${question.questionid}`}>{question.title}</Link>
        </h2>
        <div className="question-card__meta">
          {question.username && <span>Asked by {question.username}</span>}
          {question.created_at && (
            <time dateTime={question.created_at}>
              {new Date(question.created_at).toLocaleDateString()}
            </time>
          )}
        </div>
      </div>
      <Link className="button button--outline" to={`/questions/${question.questionid}`}>
        View Question
      </Link>
    </article>
  )
}

export default QuestionCard

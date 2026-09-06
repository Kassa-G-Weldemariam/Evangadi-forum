function AnswerCard({ answer }) {
  return (
    <article className="answer-card">
      <p>{answer.answer_text || answer.answer}</p>
      <div className="answer-card__meta">
        {answer.username && <span>Answered by {answer.username}</span>}
        {answer.created_at && (
          <time dateTime={answer.created_at}>
            {new Date(answer.created_at).toLocaleDateString()}
          </time>
        )}
      </div>
    </article>
  )
}

export default AnswerCard

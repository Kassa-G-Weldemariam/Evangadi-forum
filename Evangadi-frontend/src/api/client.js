const API_BASE_URL = '/api'

export const TOKEN_KEY = 'evangadi_token'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.msg || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }
  return data
}

export const authApi = {
  register: (details) => request('/users/register', {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  login: (credentials) => request('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  check: (token) => request('/users/check', {
    headers: { Authorization: `Bearer ${token}` },
  }),
}

export const questionApi = {
  getAll: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return request('/questions', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
  create: (question) => {
    const token = localStorage.getItem(TOKEN_KEY)
    return request('/questions', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(question),
    })
  },
  getById: (questionid) => {
    if (!questionid) {
      return Promise.reject(new Error('A question ID is required.'))
    }
    const token = localStorage.getItem(TOKEN_KEY)
    return request(`/questions/${encodeURIComponent(questionid)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
  createAnswer: (questionid, answerData) => {
    if (!questionid) {
      return Promise.reject(new Error('A question ID is required.'))
    }
    const token = localStorage.getItem(TOKEN_KEY)
    return request(`/questions/${encodeURIComponent(questionid)}/answers`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(answerData),
    })
  },
}

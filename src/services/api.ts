import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

api.defaults.headers.Authorization =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTb2NpYWwgTmV0d29yayBBUEkiLCJzdWIiOiIxIiwiaWF0IjoxNjIwMDc0MjMyLCJleHAiOjE2MjA2NzkwMzJ9.KTnPuffvFBWlgDzzRF8WCgzQXtV9Ukkym4jp1tYvvJo'

export default api

import './index.css'

const similarMoviesData = props => {
  const {details} = props
  const {posterPath, title} = details
  return (
    <li className="list-item">
      <img className="image" alt={title} src={posterPath} />
    </li>
  )
}
export default similarMoviesData

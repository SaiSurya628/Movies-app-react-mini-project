import {Link} from 'react-router-dom'

import './index.css'

const HomeMovieDetails = props => {
  const {eachMovie} = props
  const {title, posterPath, id} = eachMovie
  return (
    <Link to={`/movies/${id}`}>
      <li className="listing">
        <img key={id} className="imageOfFirst" alt={title} src={posterPath} />
      </li>
    </Link>
  )
}
export default HomeMovieDetails

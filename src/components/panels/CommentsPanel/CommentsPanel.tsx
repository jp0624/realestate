import { useCommentsContext } from "../../../helpers/GetComments"
import styles from "./styles.module.scss"
import { format } from "date-fns"

/**
 * CommentsPanel component displays comments and allows users to add new comments.
 * @param id - The ID of the location.
 * @returns The CommentsPanel component.
 */
const CommentsPanel = ({ id }: { id: string }) => {
	const { getCommentsById, addComment } = useCommentsContext()

	const locationComments = getCommentsById(id) || []
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const target = e.target as HTMLFormElement
		const title = (target.elements.namedItem("title") as HTMLInputElement)
			?.value
		const text = (target.elements.namedItem("comment") as HTMLInputElement)
			?.value
		const rating = parseInt(
			(target.elements.namedItem("rating") as HTMLSelectElement)?.value
		)
		const name = (target.elements.namedItem("name") as HTMLInputElement)
			?.value
		const timestamp = new Date()
		const formattedTimestamp = format(timestamp, "MMM dd, yyyy (hh:mm a)")
		const newComment = {
			title,
			text,
			rating,
			name,
			timestamp: formattedTimestamp,
			location: id,
		}
		addComment(newComment)
		target.reset()
	}

	return (
		<>
			<h2 className={`${styles.comments__heading}`}>Add a Comment</h2>
			<form onSubmit={handleSubmit}>
				<ul className={`${styles.comments__form}`}>
					<li>
						<label htmlFor='comment-name'>Name:</label>
						<input
							type='text'
							id='comment-name'
							name='name'
							placeholder='Your name'
						/>
					</li>
					<li>
						<label htmlFor='comment-title'>Title:</label>
						<input
							type='text'
							id='comment-title'
							name='title'
							placeholder='Enter title'
						/>
					</li>
					<li>
						<label htmlFor='comment-text'>Comment:</label>
						<textarea
							name='comment'
							id='comment-text'
							placeholder='Type your comment here..'
						/>
					</li>
					<li>
						<label htmlFor='comment-rating'>Rating:</label>
						<select name='rating' id='comment-rating'>
							<option value='0'>0</option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
							<option value='4'>4</option>
							<option value='5'>5</option>
						</select>
					</li>
					<li>
						<button type='submit'>Post Comment</button>
					</li>
				</ul>
			</form>

			<h2 className={`${styles.comments__heading}`}>Comments</h2>
			{locationComments.length === 0 && <p>No comments to display</p>}
			{locationComments.length > 0 && (
				<ul className={`${styles.comments__container}`}>
					{locationComments.map((comment: any, index: number) => (
						<li
							key={index}
							className={`${styles.comments__comment}`}
						>
							<h3
								className={`${styles.comments__comment__title}`}
							>
								{comment.title}
							</h3>
							<h4 className={`${styles.comments__comment__time}`}>
								{comment.timestamp}
							</h4>
							<p className={`${styles.comments__comment__text}`}>
								{comment.text}
							</p>
							<p
								className={`${styles.comments__comment__rating}`}
							>
								Rating: {comment.rating}
							</p>
							<p
								className={`${styles.comments__comment__author}`}
							>
								By: {comment.name}
							</p>
						</li>
					))}
				</ul>
			)}
		</>
	)
}

export default CommentsPanel

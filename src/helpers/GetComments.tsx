import { createContext, useContext, useEffect, useState } from "react"
import {
	collection,
	query,
	orderBy,
	addDoc,
	DocumentData,
} from "firebase/firestore"
import { useFirestore, useFirestoreCollectionData } from "reactfire"

// Create a context for comments
const CommentsContext = createContext<{
	comments: DocumentData[]
	getCommentsById: (id: any) => DocumentData[]
	addComment: (comment: any) => Promise<void>
}>({} as any) // Use type assertion to cast an empty object as the desired type

// Custom hook to access the comments context
export function useCommentsContext() {
	return useContext(CommentsContext)
}

// Provider component that wraps the children and provides the comments context
export function CommentsLocationsProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const firestore = useFirestore()
	const commentsCollection = collection(firestore, "comments")
	const commentsQuery = query(commentsCollection, orderBy("location", "asc"))
	const { status, data: comments } = useFirestoreCollectionData(
		commentsQuery,
		{
			idField: "id",
		}
	)
	const [isLoading, setIsLoading] = useState(true)

	// Set isLoading to false when the data retrieval is successful
	useEffect(() => {
		if (status === "success") {
			setIsLoading(false)
		}
	}, [status])

	// Get comments by ID
	const getCommentsById = (id: any): DocumentData[] => {
		return comments.filter((comment) => comment.location === id)
	}

	// Add a comment
	const addComment = async (comment: any): Promise<void> => {
		try {
			const docRef = await addDoc(commentsCollection, comment)
		} catch (error) {
			console.error("Error adding comment: ", error)
		}
	}

	// If still loading, display a loading message
	if (isLoading) {
		return <span>Loading...</span>
	}

	// Render the comments context provider with the children
	return (
		<CommentsContext.Provider
			value={{ comments, getCommentsById, addComment }}
		>
			{children}
		</CommentsContext.Provider>
	)
}

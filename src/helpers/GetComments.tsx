import { createContext, useContext, useEffect, useState } from "react"
import { collection, query, orderBy, addDoc } from "firebase/firestore"
import { useFirestore, useFirestoreCollectionData } from "reactfire"

const CommentsContext = createContext<any>({})

export function useCommentsContext() {
	return useContext(CommentsContext)
}

export function CommentsLocationsProvider({ children }: any) {
	const firestore = useFirestore()
	const commentsCollection = collection(firestore, "comments")
	const commentsQuery = query(
		commentsCollection,
		orderBy("timestamp", "desc")
	)
	const { status, data: comments } = useFirestoreCollectionData(
		commentsQuery,
		{
			idField: "id",
		}
	)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (status === "success") {
			setIsLoading(false)
		}
	}, [status])

	const getCommentsById = (id: any) => {
		return comments.filter((comment) => comment.location === id)
	}

	const addComment = async (comment: any) => {
		try {
			const docRef = await addDoc(commentsCollection, comment)
		} catch (error) {
			console.error("Error adding comment: ", error)
		}
	}

	if (isLoading) {
		return <span>Loading...</span>
	}

	return (
		<CommentsContext.Provider
			value={{ comments, getCommentsById, addComment }}
		>
			{children}
		</CommentsContext.Provider>
	)
}

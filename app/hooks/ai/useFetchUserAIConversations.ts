import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/app/Firebase/FirebaseConfig'
import CasaBotConversation from '@/app/types/CasaBotConversation'

const useFetchUserAIConversations = (userId: string) => {
  const [conversations, setConversations] = useState<CasaBotConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Create query for user's conversations, sorted by creation time
    const conversationsQuery = query(
      collection(db, 'casabot'), 
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      conversationsQuery,
      (querySnapshot) => {
        const conversationsData: CasaBotConversation[] = []
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          conversationsData.push({ 
            id: doc.id, 
            title: data.title,
            messages: data.messages,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            ...data
          } as CasaBotConversation)
        })
        
        setConversations(conversationsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error listening to user conversations:', err)
        setError('Failed to fetch conversations')
        setLoading(false)
      }
    )

    // Clean up listener when component unmounts or userId changes
    return () => unsubscribe()
  }, [userId])

  return { conversations, loading, error }
}

export default useFetchUserAIConversations

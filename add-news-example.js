// مثال برای اضافه کردن news item از طریق API
const addNewsItem = async () => {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: "Fresh Juices Now Available",
      description: "Experience the taste of freshly squeezed juices...",
      buttonText: "View Menu",
      order: 1,
      active: true
    })
  })
  
  const result = await response.json()
  console.log('News item added:', result)
} 
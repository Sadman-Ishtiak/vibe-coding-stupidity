import app from './app.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   InternNova Backend Server Running    ║
║   Port: ${PORT}                          
║   Environment: ${process.env.NODE_ENV || 'development'}              
╚════════════════════════════════════════╝
  `)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

export default server

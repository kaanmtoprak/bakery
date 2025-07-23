const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ message });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} zaten kullanılıyor`;
    return res.status(400).json({ message });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token süresi doldu' });
  }
  
  // Default error
  res.status(500).json({ 
    message: 'Bir şeyler ters gitti!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
};

module.exports = errorHandler; 
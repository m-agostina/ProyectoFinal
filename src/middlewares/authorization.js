export const isAdmin = (req, res, next) => {
    if (req.user && req.user.user.role === 'admin'){
        next()
    } else{
        res.status(403).send('Acceso no autorizado')
    }
}

export const isPremium = (req, res, next) => {
    if (req.user && req.user.user.role === 'premium'){
        next()
    } else{
        res.status(403).send('Acceso no autorizado')
    }
}
    
export const isAdminOrPremium = (req, res, next) => {
    if (req.user && (req.user.user.role === 'admin' || req.user.user.role === 'premium')){
        next()
    } else {
        res.status(403).send('Acceso no autorizado')
    }
}
      

export const isUser = (req, res, next) => {
    if (req.user.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Acceso no autorizado')
    }
}
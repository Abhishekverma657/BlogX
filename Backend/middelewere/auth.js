import jwt from 'jsonwebtoken'


export const authUser=(req, res, next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
     try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user=verified
         next()

     }catch(e){
        console.log(e);
        res.status(400).json({ message: 'Invalid token.' });
     }

}
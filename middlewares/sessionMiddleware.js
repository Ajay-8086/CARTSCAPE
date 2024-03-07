module.exports={
    // user session 
    userSession:(req,res,next)=>{
        try {
            if(!req.session.userId){
                res.status(401).redirect('/login')
            }else{
                next()
            }
        } catch (error) {
            console.log(error);
            res.status(500).redirect('Internal server error')
        }
        },
    adminSession:(req,res,next)=>{
        try {
            if(!req.session.adminLoggedIn){
                res.status(401).redirect('/admin/login')
            }else{
                next()
            }
        } catch (error) {
            console.log(error);
            res.status(500).redirect('Internal server error')
        }
    }
        
}
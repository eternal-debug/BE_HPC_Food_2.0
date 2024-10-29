const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Token không hợp lệ' });
            }
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json({ status: false, message: 'Người dùng chưa xác thực' });
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Khách hàng' || req.user.userType === 'Cửa hàng' || req.user.userType === 'Quản trị viên' || req.user.userType === 'Shipper') {
            next();
        }else{
            return res.status(403).json({status: false, message: 'Người dùng chưa xác thực'})
        }
    })
}

const verifyVendor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Cửa hàng' || req.user.userType === 'Quản trị viên') {
            next();
        }else{
            return res.status(403).json({status: false, message: 'Người dùng chưa xác thực'})
        }
    })
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Quản trị viên') {
            next();
        }else{
            return res.status(403).json({status: false, message: 'Người dùng chưa xác thực'})
        }
    })
};

const verifyShipper = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Shipper') {
            next();
        }else{
            return res.status(403).json({status: false, message: 'Người dùng chưa xác thực'})
        }
    })
};

module.exports = { verifyTokenAndAuthorization, verifyVendor, verifyAdmin, verifyShipper };
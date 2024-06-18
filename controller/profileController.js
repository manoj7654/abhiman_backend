const User = require('../modal/userModal');

// Get user profile
const userProfile = async (req, res) => {
    try {
        const { userId } = req.params;
          console.log(userId)
        const user = await User.findOne({
            where: { userId },
            attributes: ['userId', 'name', 'phone', 'availCoins', 'isPrime']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};


module.exports = {userProfile};

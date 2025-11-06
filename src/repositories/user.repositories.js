import User from '../models/user.model.js';

const getUsers = async () => {
    const users = await User.find();
    return users;
};

const getUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

const create = async (user) => {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
};

const findByEmail = async (email, select) => {
    const user = await User.findOne({ email }).select(select);
    return user;
};

const findByPhone = async (phonenumber) => {
    const user = await User.findOne({ phonenumber });
    return user;
};

const findUserWithPasswordByEmail = async (email) => {
    const user = await User.findOne({ email }).select('+password');
    return user;
};

const findUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

export default { getUsers, getUserById, create, findByEmail, findUserById, findByPhone, findUserWithPasswordByEmail };
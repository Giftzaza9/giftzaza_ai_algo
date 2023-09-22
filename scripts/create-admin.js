const { User } = require('../src/models');
const {connectDB, disconnectDB} = require('./settings');



const userBody =  {
      name: "admin",
      email: "",
      password: "",
      role: "admin",
      isEmailVerified: "yes",
}

async function main() {
    await connectDB();
    if (await User.isEmailTaken(userBody.email)) {
        console.log('Email already taken');
        return ;
      }

    await  User.create(userBody);
    console.log('User created')
    disconnectDB();
}

main()
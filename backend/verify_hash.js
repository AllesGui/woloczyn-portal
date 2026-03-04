const bcrypt = require('bcrypt');

const hash = '$2b$10$wT//qS47zG80EwVqVw97/.t9Jk.M/lMw3yAIFvI/7D305.X2LqVyO';
const password = 'admin123';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
});

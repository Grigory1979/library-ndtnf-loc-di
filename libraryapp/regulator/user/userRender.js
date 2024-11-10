import User from '../../models/user';

export function serializeUser(user, cb) {
    cb(null, user);
}

export function deserializeUser(user, cb) {
    User.findById(user.id, (err, userData) => {
        if (err) { return cb(err); }
        return cb(null, userData);
    });
}

export async function verifyUser(username, password, done) {
    await User.findOne({ username })
        .then((user) => {
            if (!user) { return done(null, false); }
            if (user.password === password) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch((e) => done(e));
}

// Рендер страницы пользователя
export function userLogin(req, res) {
    console.log('req.user: ', req.user);
    res.redirect('/');
}

// Выход из аккаунта
export function userLogout(req, res) {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('/');
    });
}

// Рендер профиля
export function renderProfile(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    return res.render('user/profile', { title: 'Профиль', user: req.user });
}

// Рендер авторизации
export function renderLogin(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user/login', { title: 'Вход' });
}

// Рендер регистрация
export function renderRegister(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user/register', { title: 'Регистрация' });
}

// Рендер регистрация
export async function userRegister(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    const {
        displayName, username, password,
    } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            await User.create({
                displayName, username, password,
            });
            console.log(`Пользователь "${username}" успешно добавлена в базу данных`);
            return res.redirect('/user/login');
        }
        console.log(`Пользователь "${username}" уже существует в базе данных`);
        return res.render('user/register', { title: 'Регистрация' });
    } catch (error) {
        console.error('Ошибка при добавлении пользователя:', error);
        return res.render('user/register', { title: 'Регистрация' });
    }
}
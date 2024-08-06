import React, { useEffect } from 'react';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { ProtectedRoute } from '../../protected-route/ProtectedRoute'; // Импортируйте ProtectedRoute

import { fetchAllIngredients } from '../../services/slices/ingredientsSlice';

import { checkUserAuth, getUserProfile } from '../../services/slices/userSlice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  // Модалки
  const getModal = () => {
    if (backgroundLocation) {
      return (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      );
    }
    return null;
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />

        {/* Защищенные маршруты для ForgotPassword и ResetPassword */}
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты для Profile и ProfileOrders */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        /> 

           {/* Защищенный маршрут для Register */}
           <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {getModal()}
    </div>
  );
};

export default App;

// предпоследний вариант
// import React from 'react';

// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// import {
//   ConstructorPage,
//   Feed,
//   Login,
//   Register,
//   ForgotPassword,
//   ResetPassword,
//   Profile,
//   ProfileOrders,
//   NotFound404
// } from '@pages';
// import '../../index.css';
// import styles from './app.module.css';
// import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from 'src/services/store';

// const App = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const backgroundLocation = location.state?.background;

//   const dispatch = useDispatch<AppDispatch>();

//   // Модалки
//   const getModal = () => {
//     if (backgroundLocation) {
//       return (
//         <Routes>
//           <Route
//             path='/feed/:number'
//             element={
//               <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
//                 <OrderInfo />
//               </Modal>
//             }
//           />
//           <Route
//             path='/ingredients/:id'
//             element={
//               <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
//                 <IngredientDetails />
//               </Modal>
//             }
//           />
//           <Route
//             path='/profile/orders/:number'
//             element={
//               <Modal title='Детали заказа' onClose={() => navigate(-1)}>
//                 <OrderInfo />
//               </Modal>
//             }
//           />
//         </Routes>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className={styles.app}>
//       <AppHeader />
//       <Routes location={backgroundLocation || location}>
//         <Route path='/' element={<ConstructorPage />} />
//         <Route path='/feed' element={<Feed />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/forgot-password' element={<ForgotPassword />} />
//         <Route path='/reset-password' element={<ResetPassword />} />
//         <Route path='/profile' element={<Profile />} />
//         <Route path='/profile/orders' element={<ProfileOrders />} />
//         <Route path='*' element={<NotFound404 />} />
//       </Routes>

//       {getModal()}
//     </div>
//   );
// };

// export default App;

//базовый вариант
// const App = () => (
//   <Router>
//     <div className={styles.app}>
//       <AppHeader />
//       <Routes>
//         <Route path='/' element={<ConstructorPage />} />
//         <Route path='/feed' element={<Feed />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/forgot-password' element={<ForgotPassword />} />
//         <Route path='/reset-password' element={<ResetPassword />} />
//         <Route path='/profile' element={<Profile />} />
//         <Route path='/profile/orders' element={<ProfileOrders />} />
//         <Route path='*' element={<NotFound404 />} />

//         {/* Модалки */}

//       </Routes>
//     </div>
//   </Router>
// );

// export default App;

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Recupera el token que ya vimos guardado
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Lo pega en la cabecera
      }
    });
    return next(cloned);
  }
  
  return next(req);
};
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos clave del DOM
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const navMenu = document.querySelector('nav ul');
    
    // Crear botón para ir arriba si no existe
    if (!document.querySelector('.btn-top')) {
        const btnTop = document.createElement('div');
        btnTop.className = 'btn-top';
        btnTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(btnTop);
        
        // Lógica para el botón de ir arriba
        btnTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const btnTop = document.querySelector('.btn-top');
    
    let lastScrollTop = 0;
    let isNavHidden = false;

    // Control de scroll para header, nav y botón top
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // No modificar la navegación si está en transición
        if (!isNavHidden) {
            // Ocultar o mostrar el encabezado y la navegación al hacer scroll
            if (scrollTop > lastScrollTop && scrollTop > 150) {
                header.classList.add('hidden');
                nav.classList.add('nav-scrolled');
            } else {
                header.classList.remove('hidden');
                nav.classList.remove('nav-scrolled');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Mostrar/ocultar el botón para ir arriba
        if (scrollTop > 300) {
            btnTop.classList.add('show');
        } else {
            btnTop.classList.remove('show');
        }
        
        // Marcar enlace activo basado en la sección visible
        highlightActiveSection();
    });

    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Crear menuToggle si no existe
    if (!menuToggle) {
        const newMenuToggle = document.createElement('button');
        newMenuToggle.className = 'menu-toggle';
        newMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        nav.prepend(newMenuToggle);
    }
    
    // Asignar evento al menuToggle (sea nuevo o existente)
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Smooth scroll mejorado para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Ocultar temporalmente la navegación durante el desplazamiento
                nav.classList.add('nav-hidden');
                isNavHidden = true;
                
                // Cerrar el menú móvil si está abierto
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
                
                // Calcular la posición de desplazamiento
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const navHeight = nav.offsetHeight;
                
                // Desplazarse a la posición menos la altura del menú
                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
                
                // Restaurar la navegación después de completar el desplazamiento
                setTimeout(() => {
                    nav.classList.remove('nav-hidden');
                    isNavHidden = false;
                }, 800);
                
                // Actualizar URL (opcional)
                history.pushState(null, null, targetId);
                
                // Actualizar enlaces activos
                updateActiveLinks(this);
            }
        });
    });

    // Función para marcar enlaces como activos
    function updateActiveLinks(clickedLink) {
        // Remover clase activa de todos los enlaces
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Añadir clase activa al enlace clicado
        clickedLink.classList.add('active');
    }
    
    // Función para destacar la sección activa al hacer scroll
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + nav.offsetHeight + 50;
        
        // Encontrar la sección actual
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                
                // Actualizar enlaces activos
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Filtrar documentos (mantenido de tu código original)
    const btnFiltrar = document.getElementById('btn-filtrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            const anioSeleccionado = document.getElementById('filtro-anio').value;
            const documentos = document.querySelectorAll('.documento-card');
            
            documentos.forEach(function(doc) {
                const docAnio = doc.getAttribute('data-anio');
                doc.style.display = (anioSeleccionado === 'todos' || docAnio === anioSeleccionado) ? 'flex' : 'none';
            });
        });
    }

    // Añadir el preloader al HTML si no existe
    if (!document.querySelector('.preloader')) {
        const preloaderDiv = document.createElement('div');
        preloaderDiv.className = 'preloader';
        preloaderDiv.innerHTML = '<div class="loader"></div>';
        document.body.prepend(preloaderDiv);
        
        // Ocultar preloader después de que la página cargue
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.querySelector('.preloader').style.opacity = '0';
                setTimeout(function() {
                    document.querySelector('.preloader').style.display = 'none';
                }, 500);
            }, 500);
        });
    }

    // Añadir efectos de animación a las secciones
    const secciones = document.querySelectorAll('section');
    
    // Función para comprobar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Añadir la clase de animación cuando la sección sea visible
    function animarSecciones() {
        secciones.forEach(function(seccion) {
            if (isInViewport(seccion) && !seccion.classList.contains('animado')) {
                seccion.classList.add('animado');
            }
        });
    }

    // Ejecutar la función al cargar y al hacer scroll
    animarSecciones(); // Ejecutar inmediatamente para las secciones visibles
    window.addEventListener('scroll', animarSecciones);

    // Configurar paginación para los documentos (mantenido de tu código original)
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const paginaActual = document.getElementById('pagina-actual');
    const totalPaginas = document.getElementById('total-paginas');

    if (btnAnterior && btnSiguiente && paginaActual && totalPaginas) {
        // Actualizar estado de botones de paginación
        function actualizarEstadoPaginacion() {
            const paginaActualNum = parseInt(paginaActual.textContent);
            const totalPaginasNum = parseInt(totalPaginas.textContent);
            
            btnAnterior.disabled = paginaActualNum === 1;
            btnSiguiente.disabled = paginaActualNum === totalPaginasNum;
        }

        // Configurar eventos para los botones de paginación
        btnAnterior.addEventListener('click', function() {
            const paginaActualNum = parseInt(paginaActual.textContent);
            if (paginaActualNum > 1) {
                paginaActual.textContent = paginaActualNum - 1;
                actualizarEstadoPaginacion();
                // Aquí iría la lógica para cargar los documentos de la página anterior
            }
        });

        btnSiguiente.addEventListener('click', function() {
            const paginaActualNum = parseInt(paginaActual.textContent);
            const totalPaginasNum = parseInt(totalPaginas.textContent);
            if (paginaActualNum < totalPaginasNum) {
                paginaActual.textContent = paginaActualNum + 1;
                actualizarEstadoPaginacion();
                // Aquí iría la lógica para cargar los documentos de la página siguiente
            }
        });
        
        // Inicializar el estado de los botones
        actualizarEstadoPaginacion();
    }
    
    // Inicializar el enlace activo basado en la URL actual
    const hash = window.location.hash;
    if (hash) {
        const activeLink = document.querySelector(`nav ul li a[href="${hash}"]`);
        if (activeLink) {
            updateActiveLinks(activeLink);
        }
    }
});
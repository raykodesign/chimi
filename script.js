document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO EFECTO MOUSE: BRILLITOS (SPARKLES) ---
    document.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.5) return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('mouse-sparkle');
        
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        
        const size = Math.random() * 4 + 4 + 'px';
        sparkle.style.width = size;
        sparkle.style.height = size;

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 800);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA ---
    enterBtn.addEventListener('click', () => {
        // CORRECCIÓN AQUÍ: Iniciamos la música INMEDIATAMENTE al hacer click
        // para que el navegador no la bloquee.
        playMusic(); 

        enterScreen.style.opacity = '0';
        
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            
            setTimeout(() => {
                const navMenu = document.querySelector('.nav-menu');
                if(navMenu) navMenu.classList.add('animate-buttons');
            }, 300);

            initTypewriter();
            // Ya no llamamos a playMusic() aquí, ya se llamó arriba.
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "Yo brillo donde sea, vos echate escarcha.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); 
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(20%)";
            mainLayout.style.transform = "scale(0.98)";
            
            if(modalId === 'modal-gallery') {
                setTimeout(() => {
                    updateGallery3D();
                }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/7XFZMHzHEnQ2.png",
        "https://xatimg.com/image/fVliZ87xN9xC.png",
        "https://xatimg.com/image/QFdHBDFO6dMX.jpg",
        "https://xatimg.com/image/qqDQmNlDOhik.jpg",
        "https://xatimg.com/image/52otwsn4jVNZ.jpg",
        "https://xatimg.com/image/U3YDu5dojBlC.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            
            // CORRECCIÓN: Cambié 'object-fit:cover' por 'object-fit:contain'
            // Esto hace que la imagen se ajuste dentro del marco sin recortarse
            card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:contain;">`;
            
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;

        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        if(carouselTrack) carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA ---
    const playlist = [
        // CORRECCIÓN: Agregamos "audio/" al inicio de src para que encuentre la carpeta correcta
        { 
            title: "Suspiros", 
            artist: "El Coyote Y Su Banda Tierra Santa", 
            src: "audio/Suspiros - El Coyote y su Banda Tierra Santa.mp3" 
        },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        document.getElementById('song-title').innerText = playlist[i].title;
        document.getElementById('song-artist').innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        // Promesa de reproducción para capturar errores si el archivo no existe
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // La reproducción inició correctamente
                isPlaying = true;
                vinyl.classList.add('vinyl-spin');
                playIcon.className = "fas fa-pause";
                
                if(pInt) clearInterval(pInt); // Limpiamos intervalo anterior si existe
                pInt = setInterval(() => {
                    if(audio.duration) {
                        progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                    }
                }, 100);
            })
            .catch(error => {
                console.log("Error al reproducir música: ", error);
                // Si entra aquí, verifica que el nombre del archivo 'suspiros.mp3' sea EXACTO
            });
        }
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            vinyl.classList.remove('vinyl-spin');
            playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    
    // Cargar la primera canción
    loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });
});
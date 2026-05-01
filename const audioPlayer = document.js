  const audioPlayer = document.getElementById('audioPlayer'); // Pemutar lagu karakter
  const bgMusic = document.getElementById('bgMusic'); // Lagu latar looping
  const karakterItems = document.querySelectorAll('.karakter-item'); // Semua karakter

  karakterItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');

      // Hentikan lagu latar jika sedang main
      if (!bgMusic.paused) {
        bgMusic.pause();
      }

      // Ganti lagu karakter dan play
      audioPlayer.src = src;
      audioPlayer.play();
    });
  });

  // Kalau lagu karakter selesai, lagu latar lanjut lagi
  audioPlayer.addEventListener('ended', () => {
    bgMusic.play();
  });

import { AudioMode } from '../../app/player/player';

export const es = {
    search: {
        placeholder: 'Buscar por título o número',
    },
    match: {
        remove: 'Quitar',
        start: 'Iniciar',
        lyrics: 'Letra',
        addToPlaylist: 'Agregar a playlist',
    },
    playlist: {
        header: 'Playlist',
        clear: 'Vaciar',
    },
    player: {
        current: (numeral: string) => `Himno #${numeral}`,
        buttons: {
            play: 'play_circle',
            pause: 'pause_circle',
            mute: 'volume_off',
            sound: 'volume_up',
            choir: 'groups',
            track: 'music_note',
            autoplay: 'autoplay',
            autostop: 'autostop',
            return: 'keyboard_return',
        },
        labels: {
            state: (playing: boolean) => playing ? 'Pausar' : 'Reproducir',
            mute: (muted: boolean) => muted ? 'Desmutear' : 'Mutear',
            mode: (audioMode: AudioMode) => audioMode === 'choir' ? 'Modo cantado' : 'Modo pista',
            playThrough: (playThrough: boolean) => playThrough ? 'Reproducción automática' : 'Reproducción manual',
            return: 'Regresar',
        },
    },
    reader: {
        current: (numeral: string) => `Himno #${numeral}`,
        buttons: {
            prev: 'arrow_circle_left',
            next: 'arrow_circle_right',
            return: 'keyboard_return',
        },
        labels: {
            prev: 'Anterior',
            next: 'Siguiente',
            return: 'Regresar',
        },
    },
    settings: {
        button: 'home_storage_gear',
        title: 'Ajustes',
        features: {
            through: {
                label: 'Reproducción automática',
                on: 'activada',
                off: 'desactivada',
            },
            display: {
                label: 'Permitir suspensión de pantalla',
                value: (flag: any) => flag ? 'si' : 'no',
            },
        },
        rights: 'Autoría de los recursos líricos y musicales perteneciente a sus creadores.',
        app: {
            developer: 'App desarrollada por',
            windows: 'App para Windows en',
            android: 'Disponible para Android en'
        }
    },
};
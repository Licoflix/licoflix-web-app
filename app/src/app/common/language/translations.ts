type Language = 'ptbr' | 'en';

interface TranslationSections {
    [key: string]: {
        [lang in Language]: {
            [key: string]: string;
        };
    };
}

const translations: TranslationSections = {
    module: {
        ptbr: {
            home: 'Inicio',
            login: 'Entrar',
            profile: "Perfil",
            manage: 'Gerenciar',
            myArea: 'Minha Area',
            register: 'Registrar',
            myList: 'Minha Lista',
            settings: "Configurações",
            addFilm: 'Adicionar Filme',
            settingsSubtitle: "Legendas",
        },
        en: {
            home: 'Home',
            login: 'Login',
            manage: 'Manage',
            myList: 'My List',
            myArea: 'My Area',
            profile: 'Profile',
            addFilm: 'Add Film',
            settings: 'Settings',
            register: 'Register',
            settingsSubtitle: "Subtitle",
        }
    },
    category: {
        ptbr: {
            war: 'Guerra',
            crime: 'Crime',
            action: 'Ação',
            drama: 'Drama',
            horror: 'Terror',
            family: 'Família',
            comedy: 'Comédia',
            sports: 'Esporte',
            musical: 'Musical',
            romance: 'Romance',
            history: 'História',
            western: 'Faroeste',
            mystery: 'Mistério',
            fantasy: 'Fantasia',
            thriller: 'Suspense',
            adventure: 'Aventura',
            animation: 'Animação',
            biography: 'Biografia',
            categories: 'Categorias',
            documentary: 'Documentário',
            scienceFiction: 'Ficção Científica',
            foundFootage: 'Filmagem Encontrada',
        },
        en: {
            war: 'War',
            crime: 'Crime',
            drama: 'Drama',
            family: 'Family',
            horror: 'Horror',
            comedy: 'Comedy',
            sports: 'Sports',
            action: 'Action',
            fantasy: 'Fantasy',
            history: 'History',
            mystery: 'Mystery',
            romance: 'Romance',
            musical: 'Musical',
            western: 'Western',
            thriller: 'Thriller',
            biography: 'Biography',
            adventure: 'Adventure',
            animation: 'Animation',
            categories: 'Categories',
            scienceFiction: 'Sci-Fi',
            documentary: 'Documentary',
            foundFootage: 'Found Footage',
        }
    },
    audit: {
        ptbr: {
            active: 'Ativo',
            status: 'Situação',
            inactive: 'Inativo',
            createdIn: 'Criado Em',
            createdBy: 'Criado Por',
            changedIn: 'Alterado Em',
            changedBy: 'Alterado Por'
        },
        en: {
            active: 'Active',
            status: 'Status',
            inactive: 'Inactive',
            createdBy: 'Created By',
            changedBy: 'Changed By',
            createdIn: 'Created In',
            changedIn: 'Changed In'
        }
    },
    language: {
        ptbr: {
            arabic: 'Árabe',
            german: 'Alemão',
            bengali: 'Bengali',
            chinese: 'Chinês',
            korean: 'Coreano',
            danish: 'Dinamarquês',
            spanish: 'Espanhol',
            french: 'Francês',
            greek: 'Grego',
            hebrew: 'Hebraico',
            english: 'Inglês',
            hindi: 'Hindi',
            dutch: 'Holandês',
            hungarian: 'Húngaro',
            indonesian: 'Indonésio',
            italian: 'Italiano',
            japanese: 'Japonês',
            norwegian: 'Norueguês',
            persian: 'Persa',
            polish: 'Polonês',
            portuguesePortugal: 'Português (Portugal)',
            romanian: 'Romeno',
            russian: 'Russo',
            swedish: 'Sueco',
            thai: 'Tailandês',
            tamil: 'Tâmil',
            telugu: 'Telugu',
            turkish: 'Turco',
            ukrainian: 'Ucraniano',
            urdu: 'Urdu',
            vietnamese: 'Vietnamita',
            portugueseBrazil: 'Português (Brasil)'
        },
        en: {
            arabic: 'Arabic',
            german: 'German',
            bengali: 'Bengali',
            chinese: 'Chinese',
            korean: 'Korean',
            danish: 'Danish',
            spanish: 'Spanish',
            french: 'French',
            greek: 'Greek',
            hebrew: 'Hebrew',
            english: 'English',
            hindi: 'Hindi',
            dutch: 'Dutch',
            hungarian: 'Hungarian',
            indonesian: 'Indonesian',
            italian: 'Italian',
            japanese: 'Japanese',
            norwegian: 'Norwegian',
            persian: 'Persian',
            polish: 'Polish',
            portuguesePortugal: 'Portuguese (Portugal)',
            romanian: 'Romanian',
            russian: 'Russian',
            swedish: 'Swedish',
            thai: 'Thai',
            tamil: 'Tamil',
            telugu: 'Telugu',
            turkish: 'Turkish',
            ukrainian: 'Ukrainian',
            urdu: 'Urdu',
            vietnamese: 'Vietnamese',
            portugueseBrazil: 'Portuguese (Brazil)'
        }
    },
    field: {
        ptbr: {
            year: 'Ano',
            imdb: 'IMDb',
            cast: 'Elenco',
            email: "Email",
            user: 'Usuário',
            title: 'Título',
            oscars: 'Oscars',
            search: 'Buscar',
            nameLabel: 'Nome',
            cancel: 'Cancelar',
            emailLabel: 'Email',
            password: "Senha",
            duration: 'Duração',
            details: 'Ver Mais',
            director: 'Diretor',
            subtitle: 'Legenda',
            category: 'Categoria',
            poster: 'Foto de Capa',
            directors: 'Diretores',
            passwordLable: 'Senha',
            name: 'Nome Completo',
            producers: 'Produtores',
            imdbPlaceholder: 'IMDb',
            nicknameLabel: 'Usuário',
            saveFilm: 'Salvar Filme',
            description: 'Descrição',
            uploadFile: 'Carregar.',
            createFilms: 'Criar Filme',
            baftaAwards: 'Prêmios Bafta',
            goldenGlobes: 'Globos de Ouro',
            background: 'Foto de Fundo',
            createFilm: 'Criar Filme 🎬',
            oscarsPlaceholder: 'Oscars',
            nickname: 'Nome de Usuário',
            confirmAction: 'Confirmar Ação',
            manageFilms: 'Gerenciar Filmes',
            yearPlaceholder: 'Digite o ano',
            manageUsers: 'Gerenciar Usuários',
            rating: 'Classificação Indicativa',
            audioLanguages: 'Idiomas de Áudio',
            titlePlaceholder: 'Digite o título',
            originalLanguage: 'Linguagem Original',
            repeatPasswordLable: 'Repita a Senha',
            continueWatch: 'Continuar Assistindo',
            forgotPassword: 'Esqueceu sua senha?',
            ratingInfo: 'Classificação Indicativa',
            subtitleLanguages: 'Idiomas de Legenda',
            baftaAwardsPlaceholder: 'Prêmios Bafta',
            durationPlaceholder: 'Digite a duração',
            descriptionPlaceholder: 'Digite a descrição',
            categoryPlaceholder: 'Selecione as categorias',
            ratingPlaceholder: 'Selecione a classificação',
            originalLanguagePlaceholder: 'Selecione a linguagem',
            producersPlaceholder: 'Digite os produtores (Ex: Bob, Bia)',
            directorsPlaceholder: 'Digite os diretores (Ex: Alex, Katie)',
            castPlaceholder: 'Digite o elenco (Ex: John Doe, Jane Smith)',
        },
        en: {
            cast: 'Cast',
            year: 'Year',
            imdb: 'IMDb',
            user: 'Usuário',
            title: 'Title',
            email: 'Email',
            cancel: 'Cancel',
            poster: 'Poster',
            rating: 'Rating',
            search: 'Search',
            oscars: 'Oscars',
            nameLabel: 'Name',
            details: 'Details',
            name: 'Full Name',
            emailLabel: 'Email',
            director: 'Director',
            category: 'Category',
            duration: 'Duration',
            subtitle: 'Subtitle',
            saveFilm: 'Save Film',
            password: "Password",
            nickname: 'Nickname',
            directors: 'Directors',
            producers: 'Producers',
            imdbPlaceholder: 'IMDb',
            background: 'Background',
            nicknameLabel: 'Nickname',
            passwordLable: 'Password',
            uploadFile: 'Upload File',
            manageUsers: 'Manage Users',
            description: 'Description',
            createFilms: 'Create Film',
            manageFilms: 'Manage Films',
            baftaAwards: 'Bafta Awards',
            goldenGlobes: 'Golden Globes',
            oscarsPlaceholder: 'Oscars',
            createFilm: 'Create Film 🎬',
            yearPlaceholder: 'Enter year',
            confirmAction: 'Confirm Action',
            titlePlaceholder: 'Enter title',
            ratingInfo: 'Rating Information',
            audioLanguages: 'Audio Languages',
            ratingPlaceholder: 'Enter rating',
            continueWatch: 'Continue Watching',
            forgotPassword: 'Forgot password?',
            originalLanguage: 'Original Language',
            durationPlaceholder: 'Enter duration',
            repeatPasswordLable: 'Repeat Password',
            baftaAwardsPlaceholder: 'Bafta Awards',
            subtitleLanguages: 'Subtitle Languages',
            categoryPlaceholder: 'Select categories',
            descriptionPlaceholder: 'Enter a description',
            originalLanguagePlaceholder: 'Select language',
            castPlaceholder: 'Enter cast (Ex: John, Elena)',
            producersPlaceholder: 'Enter producers (Ex: Bob, Bia)',
            directorsPlaceholder: 'Enter directors (Ex: Alex, Katie)',
        }
    },
    toasters: {
        ptbr: {
            success: 'Sucesso',
            notAllowed: 'Não Permitido',
            applicationError: 'Erro na API',
            tokenHasExpired: 'Token expirado',
            createFilmSuccess: ' criado com sucesso',
            noPermission: 'Usuário não tem a permissão ',
            failedLogin: 'Email ou senha estão inválidos',
            entitynotfoundexception: 'Entidade não encontrada',
            userExists: 'Usuário com os mesmos parametros já existe',
            usernameExists: 'Usuário com o mesmo nome de usuário já existe',
            asyncSave: 'Você será notificado assim que o processo for concluído',
            deletedUser: 'Este usuário foi excluído, entre em contato com um administrador',
            unexpectedError: 'Um erro Inesperado ocorreu, entre em contato com um adiministrador',
        },
        en: {
            successs: 'Success',
            notAllowed: 'Not Allowed',
            applicationError: 'API Error',
            tokenHasExpired: 'Token has expired',
            failedLogin: 'Invalid email or password',
            createFilmSuccess: ' created with success',
            entitynotfoundexception: 'Entity not found',
            noPermission: 'User does not have permission ',
            userExists: 'User with same params already exists',
            usernameExists: 'User with same nickname already exists',
            unexpectedError: 'Unexpected Error contact an administrator ',
            deletedUser: 'This user are deleted, contact an administrator',
            asyncSave: 'You will be notified as soon as the process completes',
        }
    },
    buttom: {
        ptbr: {
            signout: 'Sair',
            close: "Fechar",
            language: 'Idioma',
            watchNow: "Assistir",
            addList: "Adicionar a Lista",
            removeList: "Remover da Lista",
        },
        en: {
            close: "Close",
            watchNow: "Watch",
            signout: 'Sign Out',
            language: 'Language',
            addList: "Add to List",
            removeList: "Remove from List",
        }
    },
    text: {
        ptbr: {
            color: 'Cor',
            size: 'Tamanho',
            winner: 'vencedor',
            newAccount: 'Nova Conta',
            newFilms: 'Novos Filmes ⭐',
            backgroundSubtitle: 'Fundo',
            0: 'Apto para todas as idades',
            fontStyle: 'Estilo da Legenda',
            subtitleEx: "Exemplo de Legenda",
            haveAccount: 'Já tem uma conta? ',
            fontOpacity: "Opacidade da Fonte",
            noData: 'Nenhum registro encontrado',
            backgroundOpacity: 'Opacidade do Fundo',
            recordsFound: 'Registros encontrados: ',
            continueWatching: 'Continuar Assistindo',
            dontHaveAccount: 'Ainda não tem uma conta? ',
            sureQuestion: 'Tem certeza de que deseja prosseguir?',
            14: 'Pode incluir violência, drogas ou linguagem vulgar',
            12: 'Pode conter violência moderada e linguagem inadequada',
            16: 'Pode conter violência intensa, drogas ou sexo explícito',
            10: 'Pode conter cenas leves de violência ou linguagem imprópria',
            fontStyleDesc: 'Altere a maneira como as legendas aparecem ao assistir',
            18: 'Conteúdo restrito a maiores de 18 anos, com sexo explícito ou violência extrema',
        },
        en: {
            size: 'Size',
            color: 'Color',
            winner: 'winner',
            fontStyle: 'Font Style',
            newFilms: 'New Films ⭐',
            newAccount: 'New Account',
            0: 'Suitable for all ages',
            noData: 'No data available',
            fontOpacity: "Font Opacity",
            subtitleEx: "Subtitle Example",
            recordsFound: 'Records found: ',
            backgroundSubtitle: "Background",
            continueWatching: 'Continue Watching',
            backgroundOpacity: 'Background Opacity',
            haveAccount: "Alredy have an account? ",
            dontHaveAccount: "Don't have an account? ",
            sureQuestion: 'Are you sure you want to proceed?',
            14: 'May include violence, drugs, or vulgar language',
            10: 'May contain mild violence or inappropriate language',
            16: 'May contain intense violence, drugs, or explicit sex',
            12: 'May contain moderate violence and inappropriate language',
            fontStyleDesc: 'Change the way subtitles appear when watching',
            18: 'Restricted content for 18 and over, with explicit sex or extreme violence'
        }
    }
};

const findTranslation = (title: string, language: 'ptbr' | 'en' = 'en') => {
    if (title) {
        const lowerCaseTitle = title.toLowerCase().replace(" ", "");
        for (const section in translations) {
            const translationSection = translations[section];
            const translatedText = Object.keys(translationSection[language]).find(key => key.toLowerCase().replace(" ", "") === lowerCaseTitle);

            if (translatedText)
                return translationSection[language][translatedText];
        }
    }
    return title;
};

export { findTranslation, translations };


import { makeAutoObservable } from "mobx";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { findTranslation } from "../../../common/language/translations";
import { CategoryOption } from "../../../model/CategoryOption";
import { Film, FilmRequest } from "../../../model/Film";
import service from "../../../service/service";
import { store } from "../../store";

export default class FilmFormStore {

    constructor() {
        makeAutoObservable(this);
    }

    saving: boolean = false;
    selectedFilm: Film | null = null;
    activeItem: string = 'createFilms';

    initialFormValues: FilmRequest = {
        imdb: 0,
        id: null,
        cast: '',
        age: null,
        oscars: 0,
        title: '',
        year: null,
        saga: null,
        film: null,
        image: null,
        duration: '',
        language: '',
        directors: '',
        producers: '',
        categories: [],
        baftaAwards: 0,
        subtitle: null,
        goldenGlobes: 0,
        orderSaga: null,
        description: '',
        subtitleEn: null,
        background: null,
        originalTitle: '',
    };


    formValues: FilmRequest = {
        imdb: 0,
        id: null,
        cast: '',
        age: null,
        title: '',
        oscars: 0,
        year: null,
        saga: null,
        film: null,
        image: null,
        language: '',
        duration: '',
        directors: '',
        producers: '',
        baftaAwards: 0,
        goldenGlobes: 0,
        orderSaga: null,
        categories: [],
        subtitle: null,
        description: '',
        subtitleEn: null,
        background: null,
        originalTitle: '',
    };

    ageOptions = [
        { key: 0, text: 'L', value: 0 },
        { key: 10, text: '10', value: 10 },
        { key: 12, text: '12', value: 12 },
        { key: 14, text: '14', value: 14 },
        { key: 16, text: '16', value: 16 },
        { key: 18, text: '18', value: 18 },
    ];

    categoryOptions: CategoryOption[] = [
        { key: 'action', text: 'Action', value: 'Action' },
        { key: 'adventure', text: 'Adventure', value: 'Adventure' },
        { key: 'comedy', text: 'Comedy', value: 'Comedy' },
        { key: 'drama', text: 'Drama', value: 'Drama' },
        { key: 'horror', text: 'Horror', value: 'Horror' },
        { key: 'animation', text: 'Animation', value: 'Animation' },
        { key: 'romance', text: 'Romance', value: 'Romance' },
        { key: 'scienceFiction', text: 'scienceFiction', value: 'ScienceFiction' },
        { key: 'fantasy', text: 'Fantasy', value: 'Fantasy' },
        { key: 'thriller', text: 'Thriller', value: 'Thriller' },
        { key: 'foundFootage ', text: 'foundFootage ', value: 'FoundFootage ' },
        { key: 'mystery', text: 'Mystery', value: 'Mystery' },
        { key: 'crime', text: 'Crime', value: 'Crime' },
        { key: 'documentary', text: 'Documentary', value: 'Documentary' },
        { key: 'biography', text: 'Biography', value: 'Biography' },
        { key: 'war', text: 'War', value: 'War' },
        { key: 'western', text: 'Western', value: 'Western' },
        { key: 'family', text: 'Family', value: 'Family' },
        { key: 'history', text: 'History', value: 'History' },
        { key: 'sports', text: 'Sports', value: 'Sports' },
        { key: 'musical', text: 'Musical', value: 'Musical' },
        { key: 'noir', text: 'Noir', value: 'Noir' },
        { key: 'experimental', text: 'Experimental', value: 'Experimental' },
        { key: 'cult', text: 'Cult', value: 'Cult' },
        { key: 'japaneseAnimation', text: 'japaneseAnimation', value: 'JapaneseAnimation' },
    ];

    getLanguageOptions = (): { key: string, text: string, value: string }[] => {
        return [
            { key: 'arabic', text: 'Arabic', value: 'Arabic' },
            { key: 'german', text: 'German', value: 'German' },
            { key: 'bengali', text: 'Bengali', value: 'Bengali' },
            { key: 'chinese', text: 'Chinese', value: 'Chinese' },
            { key: 'korean', text: 'Korean', value: 'Korean' },
            { key: 'danish', text: 'Danish', value: 'Danish' },
            { key: 'spanish', text: 'Spanish', value: 'Spanish' },
            { key: 'french', text: 'French', value: 'French' },
            { key: 'greek', text: 'Greek', value: 'Greek' },
            { key: 'hebrew', text: 'Hebrew', value: 'Hebrew' },
            { key: 'english', text: 'English', value: 'English' },
            { key: 'hindi', text: 'Hindi', value: 'Hindi' },
            { key: 'dutch', text: 'Dutch', value: 'Dutch' },
            { key: 'hungarian', text: 'Hungarian', value: 'Hungarian' },
            { key: 'indonesian', text: 'Indonesian', value: 'Indonesian' },
            { key: 'italian', text: 'Italian', value: 'Italian' },
            { key: 'japanese', text: 'Japanese', value: 'Japanese' },
            { key: 'norwegian', text: 'Norwegian', value: 'Norwegian' },
            { key: 'persian', text: 'Persian', value: 'Persian' },
            { key: 'polish', text: 'Polish', value: 'Polish' },
            { key: 'portuguesePortugal', text: 'portuguesePortugal', value: 'portuguesePortugal' },
            { key: 'romanian', text: 'Romanian', value: 'Romanian' },
            { key: 'russian', text: 'Russian', value: 'Russian' },
            { key: 'swedish', text: 'Swedish', value: 'Swedish' },
            { key: 'thai', text: 'Thai', value: 'Thai' },
            { key: 'tamil', text: 'Tamil', value: 'Tamil' },
            { key: 'telugu', text: 'Telugu', value: 'Telugu' },
            { key: 'turkish', text: 'Turkish', value: 'Turkish' },
            { key: 'ukrainian', text: 'Ukrainian', value: 'Ukrainian' },
            { key: 'urdu', text: 'Urdu', value: 'Urdu' },
            { key: 'vietnamese', text: 'Vietnamese', value: 'Vietnamese' },
            { key: 'portugueseBrazil', text: 'portugueseBrazil', value: 'portugueseBrazil' }
        ];
    };

    handleEditClick = (entity: any) => {
        this.setSelectedFilm(entity);

        const videoBlob = entity.film ? this.base64ToFile(entity.film, 'film.mp4', 'video') : null;
        const imageBlob = entity.image ? this.base64ToFile(entity.image, 'image.jpg', 'image') : null;
        const backgroundBlob = entity.background ? this.base64ToFile(entity.background, 'background.jpg', 'image') : null;

        this.setFormValues({
            id: entity.id,
            age: entity.age,
            film: videoBlob,
            image: imageBlob,
            saga: entity.saga,
            year: entity.year,
            cast: entity.cast,
            imdb: entity.imdb,
            title: entity.title,
            oscars: entity.oscars,
            subtitle: entity.subtitle,
            language: entity.language,
            duration: entity.duration,
            background: backgroundBlob,
            orderSaga: entity.orderSaga,
            directors: entity.directors,
            producers: entity.producers,
            baftaAwards: entity.baftaAwards,
            goldenGlobes: entity.goldenGlobes,
            description: entity.description,
            categories: entity.categories || [],
            originalTitle: entity.originalTitle,
        });
        this.setActiveItem("createFilms");
    };

    base64ToFile(base64Data: string, filename: string, fileType: string): File | null {
        let mimeString = '';
        if (fileType === 'image') {
            mimeString = 'image/png';
        } else if (fileType === 'video') {
            mimeString = 'video/mp4';
        }

        if (!base64Data.startsWith('data:')) {
            base64Data = `data:${mimeString};base64,` + base64Data;
        }

        const mimeMatch = base64Data.match(/^data:([A-Za-z-+/]+);base64,/);
        if (!mimeMatch) {
            console.error("Base64 string is missing the mime type.");
            return null;
        }

        const base64Content = base64Data.split(',')[1];
        const blob = this.base64ToBlob(base64Content, mimeString);

        return new File([blob], filename, { type: mimeString });
    }

    base64ToBlob(base64Data: string, mimeType: string): Blob {
        const byteString = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: mimeType });
    }

    get validationSchema() {
        return Yup.object({
            year: Yup.number().required('Year is required'),
            cast: Yup.string().required('Cast is required'),
            image: Yup.mixed().required('Image is required'),
            title: Yup.string().required('Title is required'),
            age: Yup.number().required('Age rating is required'),
            duration: Yup.string().required('Duration is required'),
            language: Yup.string().required('Language are required'),
            directors: Yup.string().required('Directors are required'),
            producers: Yup.string().required('Producers are required'),
            description: Yup.string().required('Description is required'),
            background: Yup.mixed().required('Background image is required'),
            originalTitle: Yup.string().required('Original title is required'),
            categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required'),
        });
    }

    setActiveItem = (item: string) => {
        this.setLoading(true);
        this.activeItem = item;
        this.setLoading(false);
    }

    setSelectedFilm = (film: Film | null) => {
        this.selectedFilm = film;
    }

    getCategoryOptions = (): CategoryOption[] => {
        return this.categoryOptions
            .map(option => ({
                key: option.key,
                text: option.text,
                value: option.value
            }));
    };

    formatDuration(input: string) {
        let duration = input.replace(/\D/g, '');

        if (duration.length > 4) {
            duration = duration.slice(0, 4);
        }

        const hours = duration.slice(0, 2);
        const minutes = duration.slice(2, 4);

        return `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}min` : ''}`.trim();
    }

    setFormValues = (newValues: Partial<FilmRequest>) => {
        this.formValues = { ...this.formValues, ...newValues };
    }

    onSubmit = async (request: FilmRequest, language: any) => {
        this.saving = true;
        const formData = this.createFormData(request);

        try {
            await service.film.create(formData);
        } finally {
            await store.filmStore.list(1, 10, undefined, true);
            await store.filmStore.listNewFilms(1, 10, true);
            toast.success(`${request.title} ${findTranslation("operationSuccess", language)}`);
            this.saving = false;
        }
    };

    private createFormData(request: FilmRequest): FormData {
        const formData = new FormData();

        formData.append('cast', request.cast);
        formData.append('title', request.title);
        formData.append('duration', request.duration);
        formData.append('language', request.language);
        formData.append('directors', request.directors);
        formData.append('producers', request.producers);
        formData.append('description', request.description);
        formData.append('originalTitle', request.originalTitle);
        formData.append('age', request.age ? request.age.toString() : '0');
        formData.append('saga', request.saga ? request.saga.toString() : '');
        formData.append('year', request.year ? request.year.toString() : '0');
        formData.append('imdb', request.imdb ? request.imdb.toString() : '0');
        formData.append('oscars', request.oscars ? request.oscars.toString() : '0');
        formData.append('orderSaga', request.orderSaga ? request.orderSaga.toString() : '');
        formData.append('baftaAwards', request.baftaAwards ? request.baftaAwards.toString() : '0');
        formData.append('goldenGlobes', request.goldenGlobes ? request.goldenGlobes.toString() : '0');

        request.categories.forEach(category => {
            formData.append('categories', category);
        });

        if (request.film) formData.append('film', request.film);
        if (request.image) formData.append('image', request.image);
        if (request.subtitle) formData.append('subtitle', request.subtitle);
        if (request.background) formData.append('background', request.background);
        if (request.subtitleEn) formData.append('subtitleEn', request.subtitleEn);

        return formData;
    }

    private setLoading = (state: boolean) => {
        store.commonStore.setLoading(state).then();
    };

}
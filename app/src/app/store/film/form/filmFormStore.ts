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
    activeItem: string = 'manageUsers';

    initialFormValues: FilmRequest = {
        imdb: 0,
        id: null,
        cast: '',
        age: null,
        oscars: 0,
        title: '',
        year: null,
        film: null,
        image: null,
        duration: '',
        directors: '',
        producers: '',
        categories: [],
        baftaAwards: 0,
        subtitle: null,
        description: '',
        background: null,
    };


    formValues: FilmRequest = {
        imdb: 0,
        id: null,
        cast: '',
        age: null,
        title: '',
        oscars: 0,
        year: null,
        film: null,
        image: null,
        duration: '',
        directors: '',
        producers: '',
        baftaAwards: 0,
        categories: [],
        subtitle: null,
        description: '',
        background: null,
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
        { key: 'talk-show', text: 'Talk Show', value: 'Talk Show' },
        { key: 'reality-tv', text: 'Reality TV', value: 'Reality TV' },
        { key: 'experimental', text: 'Experimental', value: 'Experimental' },
        { key: 'cult', text: 'Cult', value: 'Cult' },
    ];

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
            year: entity.year,
            cast: entity.cast,
            imdb: entity.imdb,
            title: entity.title,
            oscars: entity.oscars,
            subtitle: entity.subtitle,
            duration: entity.duration,
            background: backgroundBlob,
            directors: entity.directors,
            producers: entity.producers,
            baftaAwards: entity.baftaAwards,
            description: entity.description,
            categories: entity.categories || [],
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
            directors: Yup.string().required('Directors are required'),
            producers: Yup.string().required('Producers are required'),
            description: Yup.string().required('Description is required'),
            background: Yup.mixed().required('Background image is required'),
            categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required'),
        });
    }

    setActiveItem = (item: string) => {
        this.setLoading(true);
        this.activeItem = item;
        this.setLoading(false);
    }

    setSelectedFilm = (film: Film) => {
        this.selectedFilm = film;
    }

    getCategoryOptions = (): CategoryOption[] => {
        return this.categoryOptions
            .sort((a, b) => a.text.localeCompare(b.text))
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
        await this.submitFilm(formData, request.title, language);
    }

    private async submitFilm(formData: FormData, title: string, language: any): Promise<void> {
        await service.film.create(formData)
            .finally(async () => {
                await store.filmStore.list(1, 10, undefined, undefined, undefined, true);
                await store.filmStore.listGroupedFilms(true);
                await new Promise(resolve => setTimeout(resolve, 200));
                toast.success(`${title + findTranslation("createFilmSuccess", language)}`)
                this.saving = false;
            });
    }

    private createFormData(request: FilmRequest): FormData {
        const formData = new FormData();

        formData.append('cast', request.cast);
        formData.append('title', request.title);
        formData.append('duration', request.duration);
        formData.append('directors', request.directors);
        formData.append('producers', request.producers);
        formData.append('description', request.description);
        formData.append('age', request.age ? request.age.toString() : '');
        formData.append('year', request.year ? request.year.toString() : '');
        formData.append('imdb', request.imdb ? request.imdb.toString() : '0');
        formData.append('oscars', request.oscars ? request.oscars.toString() : '0');
        formData.append('baftaAwards', request.baftaAwards ? request.baftaAwards.toString() : '0');

        request.categories.forEach(category => {
            formData.append('categories', category);
        });

        if (request.film) formData.append('film', request.film);
        if (request.image) formData.append('image', request.image);
        if (request.subtitle) formData.append('subtitle', request.subtitle);
        if (request.background) formData.append('background', request.background);

        return formData;
    }

    private setLoading = (state: boolean) => {
        store.commonStore.setLoading(state);
    };

}
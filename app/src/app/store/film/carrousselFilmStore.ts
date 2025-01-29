import { makeAutoObservable } from "mobx";
import React from "react";

export default class CarrousselFilmStore {
    startX = 0;
    scrollLeft = 0;
    isDragging = false;

    constructor() {
        makeAutoObservable(this);
    }

    handleMouseDown = (e: React.MouseEvent, carouselRef: React.RefObject<HTMLDivElement>) => {
        if (carouselRef.current) {
            this.isDragging = true;
            this.startX = e.pageX;
            this.scrollLeft = carouselRef.current.scrollLeft;
            carouselRef.current.style.cursor = 'grabbing';
            e.preventDefault();
        }
    };

    handleMouseMove = (e: React.MouseEvent, carouselRef: React.RefObject<HTMLDivElement>) => {
        if (this.isDragging && carouselRef.current) {
            const x = e.pageX;
            const walk = (x - this.startX) * 1.5;
            carouselRef.current.scrollLeft = this.scrollLeft - walk;
        }
    };

    handleMouseUp = (carouselRef: React.RefObject<HTMLDivElement>) => {
        if (carouselRef.current) {
            this.isDragging = false;
            carouselRef.current.style.cursor = 'grab';
        }
    };

    handleMouseLeave = (carouselRef: React.RefObject<HTMLDivElement>) => {
        if (carouselRef.current) {
            this.isDragging = false;
            carouselRef.current.style.cursor = 'grab';
        }
    };

}
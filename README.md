# GAN Integrity backend code challenge

Run `npm install`, `npm run build` and `npm run start` to start the koa api.

The api loads the required data from [here](addresses.json).

Earth is assumed to be a perfect sphere and has a radius of 6371 km.

# General comment

At this point the api does not really handle any type of cases that is outside of the spectrum of the test file. This
means that any requests which is outside of this will probably break the application, but because of the time
restriction this is I assume part of the exercise.

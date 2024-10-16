import express from 'express';
import person from './people.json' assert {type:"json"};
import randomstring from 'randomstring';
import { validatePerson } from './validation.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app= express();
const PORT=3000;
let people=person;
app.use(express.json())//capture any payloads sent from the client and assign it yo req.body
app.use(morgan('dev'));
app.use(cookieParser());


// Custom Middleware to log cookie data
app.use((req, res, next) => {
    console.log('Cookies:', req.cookies);
    next();
});

//creating end point to get data without id
app.get("/people",function(request,response){

    response.send(people)
});


//creating end point to get data with id
app.get("/people/:id",function(request,response){

    let foundPeople;
    people.forEach(function(people){
        if(people.id===request.params['id']){
            foundPeople=people;
        }
        
    })
    if (foundPeople) {
        response.json(foundPeople);
    } else {
        response.status(404).send();
    }
});
//creating end point to post data
app.post('/people',function(request,response){
    // console.log(request.body)
    const { error } = validatePerson(request.body);  // Validate input

    if (error) {
        return response.status(422).send({ errorType:"Validation Error",errorDetails: error.details });
    }
    else{
        //getting the payload and saving into our db and generating id
        request.body.id=randomstring.generate(12)
        people.push(request.body)

        //send back correct response code - created
        response.status(201).send()
    }
})

//creating end point to delete data
app.delete('/people/:id',function(request,response){
    //check to see if the  id exists in our data
    let foundperson;
    people.forEach(function(people){
        if(people.id===request.params['id']){
            foundperson=people;
        }
    })

    if(foundperson){
        people=people.filter(function(people){
            return foundperson !== people; //if this condition will be true then and only than it will allow to enter the object to insert it into array else in other words if  condion will match than it will not allow to enter the array.To understand this code it tooks lot of effort for me!
        })
        response.status(204).send()
    }
    else{
        response.status(404).send()
    }
    
})

//creating a endoint to Update and existing people by id
app.put('/people/:id',function(request,response){
    let foundperson;
    people.forEach(function(people){
        if(people.id===request.params['id']){
            foundperson=people;
        }
    })

    if(!foundperson){
        return response.status(404).send({ message: "Person not found" });   
    }

    // Validating the incoming data before updating
    const { error } = validatePerson(request.body);
    if (error) {
        return response.status(422).send({ errorType:"Validation Error",errorDetails: error.details });
    }

    people=people.map(function(people){
        if(people.id===request.params['id']){
            request.body.id= request.params.id
            return request.body   
        }
        else{
            return people;
        }
    })
    response.status(200).send()
})

// console.log(app);
app.listen(PORT,function(error){
    if(error){
        console.log(`ERROR-${error.message}`);
    }
    else{
        console.log(`App is listening on port ${PORT} `);
    }
});
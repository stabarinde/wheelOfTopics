import { Injectable } from '@angular/core';
import { Topic } from './topic';

@Injectable()

export class TopicService {

    private topicsUrl = '/api/topics';

    constructor (private http: Http) {}

    // get("/api/topics")
    getTopics(): Promise<void | Topic[]> {
      return this.http.get(this.topicsUrl)
                 .toPromise()
                 .then(response => response.json() as Topic[])
                 .catch(this.handleError);
    }

    // post("/api/topics")
    createTopic(newTopic: Topic): Promise<void | Topic> {
      return this.http.post(this.topicsUrl, newTopic)
                 .toPromise()
                 .then(response => response.json() as Topic)
                 .catch(this.handleError);
    }

    // get("/api/topics/:id") endpoint not used by Angular app

    // delete("/api/topics/:id")
    deleteTopic(delTopicId: String): Promise<void | String> {
      return this.http.delete(this.topicsUrl + '/' + delTopicId)
                 .toPromise()
                 .then(response => response.json() as String)
                 .catch(this.handleError);
    }

    // put("/api/topics/:id")
    updateTopic(putTopic: Topic): Promise<void | Topic> {
      var putUrl = this.topicsUrl + '/' + putTopic._id;
      return this.http.put(putUrl, putTopic)
                 .toPromise()
                 .then(response => response.json() as Topic)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}

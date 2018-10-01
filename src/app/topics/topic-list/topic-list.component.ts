import { Component, OnInit } from '@angular/core';
import { Topic } from '../topic';
import { TopicService } from '../topic.service';
import { TopicDetailsComponent } from '../topic-details/topic-details.component';

@Component({
  selector: 'topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
  providers: [TopicService]
  })

export class TopicListComponent implements OnInit {


  topics: Topic[]
  selectedTopic: Topic

  constructor(private topicService: TopicService) { }

  ngOnInit() {
     this.topicService
      .getTopics()
      .then((topics: Topic[]) => {
        this.topics = topics.map((topic) => {
          if (!topic.phone) {
            topic.phone = {
              mobile: '',
              work: ''
            }
          }
          return topic;
        });
      });
  }

  private getIndexOfTopic = (topicId: String) => {
    return this.topics.findIndex((topic) => {
      return topic._id === topicId;
    });
  }

  selectTopic(topic: Topic) {
    this.selectedTopic = topic
  }

  createNewTopic() {
    var topic: Topic = {
      name: '',
      email: '',
      phone: {
        work: '',
        mobile: ''
      }
    };

    // By default, a newly-created topic will have the selected state.
    this.selectTopic(topic);
  }

  deleteTopic = (topicId: String) => {
    var idx = this.getIndexOfTopic(topicId);
    if (idx !== -1) {
      this.topics.splice(idx, 1);
      this.selectTopic(null);
    }
    return this.topics;
  }

  addTopic = (topic: Topic) => {
    this.topics.push(topic);
    this.selectTopic(topic);
    return this.topics;
  }

  updateTopic = (topic: Topic) => {
    var idx = this.getIndexOfTopic(topic._id);
    if (idx !== -1) {
      this.topics[idx] = topic;
      this.selectTopic(topic);
    }
    return this.topics;
  }
}
}

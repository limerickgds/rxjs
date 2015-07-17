import Subscriber from '../Subscriber';
import SubscriberFactory from '../SubscriberFactory';
class ObserveOnSubscriber extends Subscriber {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
    }
    next(value) {
        this.scheduler.schedule(0, [this.destination, value], dispatchNext);
    }
    _error(err) {
        this.scheduler.schedule(0, [this.destination, err], dispatchError);
    }
    _complete(value) {
        this.scheduler.schedule(0, [this.destination, value], dispatchComplete);
    }
}
function dispatchNext([destination, value]) {
    var result = destination.next(value);
    if (result.done) {
        destination.dispose();
    }
}
function dispatchError([destination, err]) {
    var result = destination.error(err);
    destination.dispose();
}
function dispatchComplete([destination, value]) {
    var result = destination.complete(value);
    destination.dispose();
}
class ObserveOnSubscriberFactory extends SubscriberFactory {
    constructor(scheduler) {
        super();
        this.scheduler = scheduler;
    }
    create(destination) {
        return new ObserveOnSubscriber(destination, this.scheduler);
    }
}
export default function observeOn(scheduler) {
    return this.lift(new ObserveOnSubscriberFactory(scheduler));
}
import { EventBusExtended, EventBusSrv } from '@grafana/data';

export const appEvents: EventBusExtended = new EventBusSrv();

export default appEvents;

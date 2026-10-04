import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiBaseUrl } from '../config/api';

export interface ClassRecord {
  id: number;
  name: string;
  academicYear: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getClasses() {
    return this.http.get<ClassRecord[]>(`${this.apiBaseUrl}/classes`);
  }

  addClass(classRecord: Omit<ClassRecord, 'id'>) {
    return this.http.post<ClassRecord>(`${this.apiBaseUrl}/classes`, classRecord);
  }

  updateClass(id: number, classRecord: Omit<ClassRecord, 'id'>) {
    return this.http.put<ClassRecord>(`${this.apiBaseUrl}/classes/${id}`, classRecord);
  }

  deleteClass(id: number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/classes/${id}`);
  }
}

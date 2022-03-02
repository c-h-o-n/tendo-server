import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('')
  async search(@Query() queryParams) {
    const { term, type } = queryParams;
    console.log(term, type);

    const response = await this.searchService.search(term);

    return response;
  }
}

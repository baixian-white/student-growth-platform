package com.education.scheduler;

import com.education.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * CrawlerScheduler — 定时触发 Python 爬虫
 *
 * 默认每天凌晨 02:00 自动爬取（可在 application.yml 的 crawler.cron 中修改）
 * 若需立即触发，调用 POST /api/exam-info/trigger-crawl（带 X-Crawler-Key 请求头）
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlerScheduler {

    private final CrawlerService crawlerService;

    @Value("${crawler.cron:0 0 2 * * ?}")
    private String cronExpression;   // 供日志输出，实际 cron 由注解读取

    /**
     * 每天凌晨 02:00 执行一次爬取任务。
     * cron 表达式从配置文件读取（默认 "0 0 2 * * ?"）。
     */
    @Scheduled(cron = "${crawler.cron:0 0 2 * * ?}")
    public void scheduledCrawl() {
        log.info("=== 定时爬虫触发 (cron: {}) ===", cronExpression);
        crawlerService.runCrawler();
    }
}
